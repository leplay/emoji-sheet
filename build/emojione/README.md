# Building the Apple emoji images

Download latest EmojiOne emoji on [https://www.emojione.com/download](https://www.emojione.com/download).
Find and copy the .ttc file to this folder.

You may need to install a Perl module first:

    perl -MCPAN -e"install Font::TTF"

Then run the extractor script:

    perl extract.pl

This will populate the latest image files into `./img-emojione-160`.

Next you'll want to cut the 64px versions that are used in the sheets"

    php make64.php


## Updating to new Unicode versions

When updating the image-set to add new codepoints, there's a confusing sequence required:

* Update the unicode data files
* Run `apple/extract.pl` to pull the 160px images
* Run `apple/make64.php` to make the 64px images

