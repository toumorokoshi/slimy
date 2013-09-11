import os
import sys
from markdown import Markdown
from xml.etree.ElementTree import Element


def create_markdown(file_name):
    m = Markdown()
    output = None
    with open(file_name, 'r') as fh:
        tree = m.parser.parseDocument(fh.read().split("\n"))
        root_node = tree.getroot()
        slide_tags = ['h1', 'h2']
        # if we find more than 1 h1 tag, we assume that h1 represents a slide.
        # if there's only one, the first h1 is probably the title slide.
        if len(filter(lambda e: e.tag == 'h1', root_node)) > 1:
            slide_tags = ['h1']
        new_root = Element('section', attrib={
            'id': 'slides'
        })
        slide_element = None
        for node in root_node:
            if node.tag in slide_tags:
                node.tag = 'h1'
                if slide_element is not None:
                    new_root.append(slide_element)
                slide_element = Element('article')
            if slide_element is not None:
                slide_element.append(node)
        if slide_element is not None:
            new_root.append(slide_element)
        output = m.serializer(new_root)
    if output:
        output_file_name = file_name.split('/')[-1].split('.')[0] + '.html'
        template = None
        with open('template.html', 'r') as fh:
            template = fh.read()
        with open(output_file_name, 'w+') as output_fh:
            print "Creating {0}...".format(output_file_name)
            output_fh.write(template.format(**{
                'body': output
            }))


def main():
    assert len(sys.argv) > 1, "Please pass a filename to a markdown file!"
    file_path = sys.argv[1]
    assert os.path.exists(file_path), "File {0} does not exist!".format(file_path)
    create_markdown(file_path)

if __name__ == '__main__':
    main()
