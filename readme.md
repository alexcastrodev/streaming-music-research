# Introduction

Before i start the project, i had some question about music streaming on Browser.

1. When I use the `<audio>` tag with a `<source>` for it, will it download the entire music file or give me chunks?

2. Will it start downloading when I click the play button?

3. How can I send chunks of audio to the client?

4. Can I use the `<audio>` tag for streaming?

# Let's test step by step

## 1. When I use the `<audio>` tag with a `<source>` for it, will it download the entire music file or give me chunks?

To discover, i will create a simple html, and find random music on the internet to test.

We can see the headers in this picture:

<img src=".github/1_headers.png" />

We can see that the browser start sending the request with the range header, and the server respond with the status code 206, that means partial content.

PS: The server need to support the range header, if not, the browser will request the entire file.

The Range in header is: `bytes=0-` that means the browser want the bytes from 0 to the end of the file.

So the answer is: The browser request the entire file, but the server respond with the partial content with a `keep-alive` connection.

### Additional questions:

Based on Question 01, the partial content is provided by the server or the browser?

The answer is: Server

Another question: If the browser request the entire file, and the server respond with the partial content ( WITH ZERO BYTES ) , how the browser knows the time of music?

The answer is: The browser will request the entire file, but the server will respond with the partial content with the `Content-Length` header, that means the size of the file.

For example, Look the headers response:

```http
Accept-Ranges: bytes
Connection: keep-alive
Content-Disposition: attachment; filename="sjjc_T_001.mp3"
Content-Length: 5120086
Content-Type: audio/mpeg
Date: Mon, 26 Jun 2023 22:54:25 GMT
```

So, audio/mpeg is 5120086 bytes, that means 5.12 mb.

How can i know the duration of the audio?
https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer/duration

Here's another way to know how you can calculate the duration of an audio file in the audio/mpeg format:

1 - Determine the file size of the MPEG audio file in bytes.

2 - Obtain the bit rate of the audio file in kilobits per second (kbps). You can usually find this information in the file's metadata or specifications.

3 - Convert the file size from bytes to kilobits. Divide the file size by 8 to convert it to kilobits since there are 8 bits in a byte.

4 - Calculate the duration using the formula:

duration = file size (in kilobits) / bit rate (in kilobits per second)

Our file has 5120086 bytes, so we need to convert to kilobits, so:

duration = 5120086 bytes * 0.008 = 40960.688 kilobits

duration = 40960.688 / 256 kbps** = 160 Seconds

duration = 160 Seconds = 2.6666 Minutes = 2 Minutes and 39 Seconds

** A bit rate of 256 kbps is considered a relatively high-quality setting for MP3 audio. At this bit rate, the audio is encoded at a higher level of detail, resulting in clearer and more accurate representation of the original sound. However, it also leads to larger file sizes compared to lower bit rates.

Another question:

How does Browser knows if if bit rate is 256 kbps?

`The awnser is pending`

The range of bytes is provided by the server or the browser?

The answer is: Server on Headers Response

## 2. Will it start downloading when I click the play button?

Yes, as we said in the previous question, the browser will request the entire file, but the server will respond with the partial content. So, if file is 09 mb, the browser will download 09 mb, but the server will respond with 1 mb, and the browser will request the next 1 mb, and so on.

In my example, the browser was setted to throlling `fast 3G`, so the browser will request 09 mb, but the server will respond with 100kb.

## 3. How can I send chunks of audio to the client?

`The awnser is pending`

## 4. Can I use the `<audio>` tag for streaming?

Sure, you can use the `<audio>` tag for streaming music.


# References

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio

https://developer.mozilla.org/en-US/docs/Web/API/MediaSource

https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

http://mpgedit.org/mpgedit/mpeg_format/MP3Format.html