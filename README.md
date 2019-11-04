# Emoji Sheet 

Keep your emoji sheet up to date. Build on top of [iamcal/emoji-data](https://github.com/iamcal/emoji-data).

### Emoji Status Counts
Unicode version: 12.0. Data from [https://unicode.org/Public/emoji/12.0/emoji-test.txt](https://unicode.org/Public/emoji/12.0/emoji-test.txt)

Type | Count
---- | ----
fully-qualified | 3010
minimally-qualified | 571
unqualified | 246
component | 9

### Build Counts
Provider | Success | Failed  | Original Size | Compressed Size
-------- | ------- | ------- | ------------- | ---------------
Apple | 3007 | 3 | 13.7 MB [Open](https://cdn.jsdelivr.net/npm/emoji-sheet/sheet/apple_64.png) | To Do
Twitter | 2996 | 14 | 8.5 MB [Open](https://cdn.jsdelivr.net/npm/emoji-sheet/sheet/twitter_64.png) | To Do
EmojiOne | 2795 | 215 | 8.5 MB [Open](https://cdn.jsdelivr.net/npm/emoji-sheet/sheet/emojione_64.png) | To Do


### Usage
Warning: the emoji's short_name might be different from other projects.
```
npm install emoji-sheet
```
#### Generate emoji list
```javascript
const { getEmoji } = require('emoji-sheet')

// get list
var appleList = getEmoji('apple')
var twitterList = getEmoji('twitter')
var emojioneList = getEmoji('emoji')

// get list with skin tone
var appleListWithLightSkinTone = getEmoji('apple', 2)
```
You can also use [sheet/result.json](./sheet/result.json) to generate your own emoji list.

Skin | Meaning
----| ----
0 | Emoji with no skin tone
1 | Emoji with default skin tone
2 | Emoji with light skin tone
3 | Emoji with medium-light skin tone
4 | Emoji with medium skin tone
5 | Emoji with medium-dark skin tone
6 | Emoji with dark skin tone'


## Build
```sh
cd build/apple
# update apple emoji
cd build/emojione
# update emojione
cd build/twitter
# update twemoji

cd ../../
node generate-dict.js
node generate-config.js
node build-sheet.js
```

## Image Sources

Images are extracted from their sources and this library attempts to track the latest
available versions.

* Apple Emoji: Copyright &copy; Apple Inc. - macOS 10.15.1 (Mojave)
* Twitter Emoji([Twemoji](https://github.com/twitter/twemoji)): Copyright &copy; Twitter, Inc. - v12.1.3
* EmojiOne([JoyPixels](https://www.joypixels.com/)): Copyright &copy; JoyPixels, Inc. - v5.1

Apple images are not licensed for commerical usage. Twitter emoji are available under the [Creative Commons Attribution 4.0 license](https://github.com/twitter/twemoji/blob/gh-pages/LICENSE-GRAPHICS). EmojiOne(JoyPixels) has free and business license, more details on their [website](https://www.joypixels.com/licenses).

