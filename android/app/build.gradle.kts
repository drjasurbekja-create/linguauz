plugins {
    id("com.android.application")
}

android {
    namespace = "uz.linguauz.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "uz.linguauz.app" // keyin özgartirib bölmaydi
        minSdk = 24 // Android 7.0+ (androidbrowserhelper talabi)
        targetSdk = 36
        // Har yangi APK'da versionCode'ni 1 ga oşiring, aks holda telefon yangilanişni qabul qilmaydi
        versionCode = 2
        versionName = "1.1"
    }

    buildTypes {
        release {
            // Işlatilmagan kod va resurslar olib taşlanadi — APK bir nečta barobar kiçrayadi
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"))
            // Imzo bu yerda emas: APK yiğilgandan keyin apksigner bilan imzolanadi (parol faylda saqlanmasin)
        }
    }
}

dependencies {
    // Saytni Chrome'da manzil qatorisiz, ilova kabi oçadi (Google'ning rasmiy kutubxonasi)
    implementation("com.google.androidbrowserhelper:androidbrowserhelper:2.7.4")
}
