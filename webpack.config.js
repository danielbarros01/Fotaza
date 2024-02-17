import path from 'path'

export default {
    mode: 'development',
    entry:{
        closeAlert: './src/js/closeAlert.js',
        sendCategories: './src/js/sendCategories.js',
        addPublication: './src/js/publication/addPublication.js',
        modifyRating: './src/js/rating/modifyRating.js',
        getOverallRating: './src/js/rating/getOverallRating.js',
        clicksPublication: './src/js/publication/clicksPublication.js',
        addComment: './src/js/comments/addComment.js',
        getComments: './src/js/comments/getComments.js',
        editPublication: './src/js/publication/editPublication.js',
        deletePublication: './src/js/publication/deletePublication.js',
        tags: './src/js/publication/tags.js',
        privacyOptions: './src/js/publication/create/privacyOptions.js',
        categoriesOptions: './src/js/publication/create/categoriesOptions.js',
        allCategories: './src/js/publication/create/allCategories.js',
        validationsCreate: './src/js/publication/create/validations.js',
        multiStageForm: './src/js/publication/create/multiStageForm.js',
        salePublication: './src/js/publication/create/salePublication.js',
        licenses: './src/js/publication/create/licenses.js',
        watermark: './src/js/publication/create/watermark.js',
        errorsBackend: './src/js/publication/create/errorsBackend.js',
        userMenu: './src/js/header/userMenu.js',
        alertAccount: './src/js/user/alertAccount.js',
        picturesAccount: './src/js/user/picturesAccount.js',
        coverAccount: './src/js/user/coverAccount.js',
        userProfile: './src/js/user/profile.js',
        getResolution: './src/js/helpers/getResolution.js',
        homePublications: './src/js/publications/homePublications.js',

        homeSearch: './src/js/search/homeSearch.js',
        searchTags: './src/js/search/searchTags.js',
        searchFilters: './src/js/search/searchFilters.js',
        ajaxSearch: './src/js/search/ajaxSearch.js',

        homeCaraousel: './src/js/homeCarousel.js',

        inputChatF: './src/js/chat/inputChatF.js',
        chat: './src/js/chat/chat.js',
        chatF: './src/js/chat/chatF.js',
        sendMessage: './src/js/chat/publication/sendMessage.js',
    },
    output:{
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}