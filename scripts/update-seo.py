#!/usr/bin/env python3
"""Refresh Nabu Guides metadata and sitemaps for its canonical Nabulines home."""
from pathlib import Path
from html import escape
from html.parser import HTMLParser
from urllib.parse import urljoin
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://www.nabulines.com/nabuguides/'
OLD = 'https://alisharafiiii.github.io/nabu-guides/'
START, END = '<!-- nabulines-seo:start -->', '<!-- nabulines-seo:end -->'

class Metadata(HTMLParser):
    def __init__(self):
        super().__init__(); self.lang='en'; self.title=''; self.in_title=False; self.meta={}; self.images=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='html': self.lang=a.get('lang','en')
        if tag=='title': self.in_title=True
        if tag=='meta': self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='img' and a.get('src'): self.images.append(a['src'])
    def handle_endtag(self,tag):
        if tag=='title': self.in_title=False
    def handle_data(self,data):
        if self.in_title: self.title+=data

def metadata_tag(key, value):
    attr='property' if key.startswith('og:') else 'name'
    return f'<meta {attr}="{key}" content="{escape(value,quote=True)}">'

def remove_old_tag(match):
    tag=match.group()
    parsed=Metadata();parsed.feed(tag)
    if tag.lower().startswith('<meta'):
        if any(k.startswith(('og:','twitter:')) for k in parsed.meta):return ''
    elif re.search(r'\brel=[\"\'](?:canonical|alternate)[\"\']',tag,re.I):
        if 'canonical' in tag or 'hreflang' in tag:return ''
    return tag

pages=[ROOT/'index.html',*sorted((ROOT/'articles').glob('*.html'))]
urls=[]
for file in pages:
    html=file.read_text().replace(OLD,BASE)
    previous=Metadata();previous.feed(html)
    html=re.sub(re.escape(START)+r'.*?'+re.escape(END), '',html,flags=re.S)
    relative=file.relative_to(ROOT).as_posix()
    url=BASE if relative=='index.html' else urljoin(BASE,relative)
    urls.append(url)
    title=previous.title.strip()
    headline=re.sub(r'\s*\|\s*nabuguides\s*$','',title,flags=re.I)
    description=previous.meta.get('description','')
    image=previous.meta.get('og:image')
    if not image and previous.images:image=urljoin(url,previous.images[0])
    image=image or BASE+'assets/profile/nabu.jpg'
    head_match=re.search(r'<head>(.*?)</head>',html,re.S|re.I)
    assert head_match,file
    head=re.sub(r'<(?:meta|link)\b[^>]*>',remove_old_tag,head_match.group(1),flags=re.I)
    head=re.sub(r'[ \t]+\n', '\n', head)
    head=re.sub(r'\n{3,}', '\n\n', head)
    tags=[f'<link rel="canonical" href="{url}">',metadata_tag('og:site_name','Nabu Guides'),metadata_tag('og:type','website' if relative=='index.html' else 'article'),metadata_tag('og:title',headline),metadata_tag('og:description',description),metadata_tag('og:url',url),metadata_tag('og:locale','fa_IR' if previous.lang=='fa' else 'en_US'),metadata_tag('og:image',image),metadata_tag('og:image:alt',previous.meta.get('og:image:alt',headline)),metadata_tag('twitter:card','summary_large_image'),metadata_tag('twitter:title',headline),metadata_tag('twitter:description',description),metadata_tag('twitter:image',image)]
    for dimension in ('width','height'):
        if previous.meta.get('og:image:'+dimension):tags.append(metadata_tag('og:image:'+dimension,previous.meta['og:image:'+dimension]))
    if file.name.endswith(('-fa.html','-en.html')):
        stem=file.name[:-8]
        pair=[file.with_name(stem+'-'+lang+'.html') for lang in ('en','fa')]
        if all(p.exists() for p in pair):
            for lang,p in zip(('en','fa'),pair):tags.append(f'<link rel="alternate" hreflang="{lang}" href="{BASE}articles/{p.name}">')
    entity={'@context':'https://schema.org','@type':'CollectionPage' if relative=='index.html' else 'Article','headline':headline,'description':description,'url':url,'inLanguage':['en','fa'] if relative=='index.html' else previous.lang,'image':image,'isPartOf':{'@type':'WebSite','name':'Nabu Guides','url':BASE},'author':{'@type':'Person','name':'Nabu','url':BASE+'#about'}}
    if relative!='index.html':entity['mainEntityOfPage']={'@type':'WebPage','@id':url}
    tags.append('<script type="application/ld+json">'+json.dumps(entity,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+'</script>')
    script='assets/site-move.js' if relative=='index.html' else '../assets/site-move.js'
    tags.append(f'<script src="{script}"></script>')
    block=START+'\n'+'\n'.join(tags)+'\n'+END
    html=html[:head_match.start(1)]+head.rstrip()+'\n'+block+'\n'+html[head_match.end(1):]
    if relative=='index.html' and 'href="https://www.nabulines.com/"' not in html:
        html=html.replace('<div class="navlinks">','<div class="navlinks"><a href="https://www.nabulines.com/">Nabulines ↗</a>',1)
    file.write_text(html)

ET.register_namespace('','http://www.sitemaps.org/schemas/sitemap/0.9')
ns='{http://www.sitemaps.org/schemas/sitemap/0.9}'
for name,locations in [('sitemap.xml',urls),('site-sitemap.xml',['https://www.nabulines.com/',*urls])]:
    root=ET.Element(ns+'urlset')
    for url in locations:ET.SubElement(ET.SubElement(root,ns+'url'),ns+'loc').text=url
    ET.indent(root)
    ET.ElementTree(root).write(ROOT/name,encoding='utf-8',xml_declaration=True)
    with (ROOT/name).open('a') as f:f.write('\n')
(ROOT/'robots.txt').write_text('User-agent: *\nDisallow:\n\nSitemap: https://www.nabulines.com/sitemap.xml\n')
print(f'Updated metadata for {len(pages)} pages; generated guide and site sitemaps.')
