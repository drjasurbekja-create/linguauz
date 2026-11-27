// LinguaUZ Android ilovasi — saytni Chrome orqali töliq ekranda oçadigan qobiq (Trusted Web Activity)
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "LinguaUZ"
include(":app")
