import {app} from './routers/main-router.js'

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is running on port ' + port);
})