package com.allio

import android.app.Activity
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class PiPModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "PiPModule"
    }

    @ReactMethod
    fun enterPiP() {
        val currentActivity = currentActivity
        if (currentActivity != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            currentActivity.enterPictureInPictureMode()
        }
    }
}
