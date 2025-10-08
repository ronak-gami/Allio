# Photo and Video Editing with Imgly SDK 1.56.0

## Overview of Imgly SDK
The Imgly SDK is a powerful toolkit for adding photo and video editing capabilities to your applications. Version 1.56.0 includes a variety of features that enhance user experience.

## Setup for Android
1. **Add the Dependency**: 
   To use Imgly SDK in your Android project, add the following line to your `build.gradle` file:
   ```groovy
   implementation 'com.img.ly:editor:1.56.0'
   ```
2. **Permissions**: Ensure you have the necessary permissions in your `AndroidManifest.xml`.

3. **Initialization**: Initialize the Imgly SDK in your application class.

## Setup for iOS
1. **CocoaPods**: Add the Imgly SDK to your `Podfile`:
   ```ruby
   pod 'ImglyKit', '~> 1.56.0'
   ```
2. **Permissions**: Request the necessary permissions in your `Info.plist`.

3. **Initialization**: Initialize the SDK in your AppDelegate.

## Photo Editor Service
### Filters
- Description of available filters and how to apply them.

### Text
- How to add and customize text on images.

### Stickers
- Instructions for adding stickers to photos.

## Video Editing Features
- Overview of video editing capabilities, including trimming, filters, and effects.

## Customization Options
- Discuss how to customize the editor interface and available tools.

## Integration with `react-native-image-picker`
- Step-by-step guide on integrating Imgly SDK with `react-native-image-picker` for seamless media selection.