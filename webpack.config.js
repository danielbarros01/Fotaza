import path from 'path'

export default {
    mode: 'development',
    entry:{
        closeAlert: './src/js/closeAlert.js',
        sendCategories: './src/js/sendCategories.js'
    },
    output:{
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}