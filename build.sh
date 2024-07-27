#!/bin/bash

# Navigate to the project directory
cd /path/to/AdaptMobile

# Clean the build
./gradlew clean

# Build the release APK
./gradlew assembleRelease

# Find the APK
APK_PATH=$(find ./android/app/build/outputs/apk/release -name '*.apk')

# Get the size of the APK
APK_SIZE=$(du -h "$APK_PATH" | cut -f1)

echo "The compiled APK size for Android is: $APK_SIZE"