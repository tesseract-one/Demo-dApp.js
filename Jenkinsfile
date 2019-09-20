@Library("crossroadlabs")
import xyz.crossroadlabs.NodeJS;

def CONFIG = [
    BUILD_MACHINE: "linux && x64",
    PRODUCT_PATH: "./dist/",
    IGNORE_DIRS: [ "*.map", ".git", ".well-known", "vendor" ],
    VERSION: "./dist/version.txt",
    ENV: [
        staging: [
            SSH_USER: "tesseract",
            SSH_SERVER: "staging.crossroadlabs.xyz",
            INSTALL_PATH: "~/demo/",
            SSH_KEY: "tesseract-staging",
            URL: "http://demo.staging.crossroadlabs.xyz",
            NODE_ENV: "development"
        ],
        sprint: [
            // SSH_USER: "main",
            // SSH_SERVER: "staging.crossroadlabs.xyz",
            // INSTALL_PATH: "~/demo-sprint/",
            // SSH_KEY: "tesseract-staging",
            URL: "http://demo.staging.crossroadlabs.xyz",
            NODE_ENV: "development"
        ],
        prod: [
            SSH_USER: "tesseract",
            SSH_SERVER: "local.crossroad.io",
            INSTALL_PATH: "~/demo/",
            SSH_KEY: "tesseract-production",
            URL: "https://demo.tesseract.one",
            NODE_ENV: "production"
        ]
    ]
]

def actions = []

actions << [/^feature.+$/, CONFIG["BUILD_MACHINE"], { script, context ->
    def builder = new NodeJS(script)
    builder.checkout()
    builder.installDependencies()
    builder.withENV([
        BASE_URL: context["ENV"]["sprint"]["URL"],
        NODE_ENV: context["ENV"]["sprint"]["NODE_ENV"]
    ]) {
        builder.build()
    }
    builder.lint()
    // if (!builder.isAutomatedBuild()) {
    //     builder.saveVersion(context["VERSION"], context["BRANCH"])
    //     script.stage("Deployment") {
    //         builder.rsyncUpload(
    //             context["PRODUCT_PATH"],
    //             context["ENV"]["sprint"]["SSH_KEY"],
    //             context["ENV"]["sprint"]["SSH_USER"],
    //             context["ENV"]["sprint"]["SSH_SERVER"],
    //             context["ENV"]["sprint"]["INSTALL_PATH"],
    //             context["IGNORE_DIRS"]
    //         )
    //     }
    // }
}]

actions << [/^sprint.+$/, CONFIG["BUILD_MACHINE"], { script, context ->
    def builder = new NodeJS(script)
    builder.checkout()
    builder.installDependencies()
    builder.withENV([
        BASE_URL: context["ENV"]["sprint"]["URL"],
        NODE_ENV: context["ENV"]["sprint"]["NODE_ENV"]
    ]) {
        builder.build()
    }
    builder.lint()
    // builder.saveVersion(context["VERSION"], context["BRANCH"])
    // script.stage("Deployment") {
    //     builder.rsyncUpload(
    //         context["PRODUCT_PATH"],
    //         context["ENV"]["sprint"]["SSH_KEY"],
    //         context["ENV"]["sprint"]["SSH_USER"],
    //         context["ENV"]["sprint"]["SSH_SERVER"],
    //         context["ENV"]["sprint"]["INSTALL_PATH"],
    //         context["IGNORE_DIRS"]
    //     )
    // }
}]

actions << [/^develop$/, CONFIG["BUILD_MACHINE"], { script, context ->
    def builder = new NodeJS(script)
    builder.checkout()
    builder.installDependencies()
    builder.withENV([
        BASE_URL: context["ENV"]["staging"]["URL"],
        NODE_ENV: context["ENV"]["staging"]["NODE_ENV"]
    ]) {
        builder.build()
    }
    builder.lint()
    builder.saveVersion(context["VERSION"], context["BRANCH"])
    script.stage("Deployment") {
        builder.rsyncUpload(
            context["PRODUCT_PATH"],
            context["ENV"]["staging"]["SSH_KEY"],
            context["ENV"]["staging"]["SSH_USER"],
            context["ENV"]["staging"]["SSH_SERVER"],
            context["ENV"]["staging"]["INSTALL_PATH"],
            context["IGNORE_DIRS"]
        )
    }
}]

actions << [/^master$/, CONFIG["BUILD_MACHINE"], { script, context ->
    def builder = new NodeJS(script)
    builder.checkout()
    builder.installDependencies()
     builder.withENV([
        BASE_URL: context["ENV"]["prod"]["URL"],
        NODE_ENV: context["ENV"]["prod"]["NODE_ENV"]
    ]) {
        builder.build()
    }
    builder.lint()
}]

actions << [/^release\/(.+)/, CONFIG["BUILD_MACHINE"], { script, context ->
    def builder = new NodeJS(script)
    builder.checkout()
    builder.installDependencies()
     builder.withENV([
        BASE_URL: context["ENV"]["prod"]["URL"],
        NODE_ENV: context["ENV"]["prod"]["NODE_ENV"]
    ]) {
        builder.build()
    }
    builder.lint()
    builder.saveVersion(context["VERSION"], context["BRANCH"])
    script.stage("Deployment") {
        builder.rsyncUpload(
            context["PRODUCT_PATH"],
            context["ENV"]["prod"]["SSH_KEY"],
            context["ENV"]["prod"]["SSH_USER"],
            context["ENV"]["prod"]["SSH_SERVER"],
            context["ENV"]["prod"]["INSTALL_PATH"],
            context["IGNORE_DIRS"]
        )
        //builder.remoteCommand(
        //    context["ENV"]["prod"]["SSH_KEY"],
        //    context["ENV"]["prod"]["SSH_USER"],
        //    context["ENV"]["prod"]["SSH_SERVER"],
        //    "cd ${context["ENV"]["prod"]["INSTALL_PATH"]} && composer install"
        //)
    }
}]

performAction("${env.BRANCH_NAME}", CONFIG, actions)