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
        userMenu: './src/js/header/userMenu.js',
        alertAccount: './src/js/user/alertAccount.js',
        picturesAccount: './src/js/user/picturesAccount.js',
        getResolution: './src/js/helpers/getResolution.js',
    },
    output:{
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}