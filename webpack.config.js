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
    },
    output:{
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}