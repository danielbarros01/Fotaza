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
    },
    output:{
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}