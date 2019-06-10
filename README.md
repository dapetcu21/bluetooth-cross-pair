# `bluetooth-cross-pair`

Small utility that automates the process of copying Bluetooth keys from one
OS to the other.

Why need this? To keep from having to repair my mouse and keyboard whenever
I switch OS'es in a multi-boot system.

## Cool! How do I install it?

Install Node.js, then:

```bash
npm install -g bluetooth-cross-pair
```

On Windows, you'll also need
[PSExec](https://docs.microsoft.com/en-us/sysinternals/downloads/psexec)
in your `PATH`

## Aaand... how do I use it?

1. Go and pair your devices with all of your OS'es first
2. On the last OS you paired with, run
`sudo bluetooth-cross-pair export keys.json 00112233aabbcc 445566ddeeff`,
where `00112233aabbcc` and `445566ddeeff` are the MAC addresses of your keyboard
and mouse. You can save any number of devices in one key file.
3. On all the other OS'es, run `sudo bluetooth-cross-pair import keys.json`

## OS support

Current OS compatibility table. Feel free to implement import/export for other
OS'es:

|OS|Import|Export|
|-|-|-|
|macOS|No|Yes|
|Windows|Yes|No|
|Ubuntu|Yes|No|
