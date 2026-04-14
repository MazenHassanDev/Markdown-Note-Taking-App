import markdown2
import re

def convert_to_html(content):
    return markdown2.markdown(content)

def strip_markdown(content):
    temp = markdown2.markdown(content)
    return re.sub(r'<[^>]+>', '', temp)
