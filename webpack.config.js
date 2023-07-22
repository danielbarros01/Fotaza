import path from 'path'

export default {
    mode: 'development',
    entry:{
        closeAlert: './src/js/closeAlert.js',
        sendCategories: './src/js/sendCategories.js',
        addPublication: './src/js/addPublication.js',
        modifyRating: './src/js/rating/modifyRating.js',
        getOverallRating: './src/js/rating/getOverallRating.js',
        clicksPublication: './src/js/clicksPublication.js',
        addComment: './src/js/comments/addComment.js',
        getComments: './src/js/comments/getComments.js',
        editPublication: './src/js/editPublication.js',
        tags: './src/js/tags.js',
    },
    output:{
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}