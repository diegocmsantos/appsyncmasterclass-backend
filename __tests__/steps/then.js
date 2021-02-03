require('dotenv').config()
const AWS = require('aws-sdk')
const http = require('axios')
const fs = require('fs')

const user_exists_in_UsersTable = async (id) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient()

    console.log(`looking for user [${id}] in table [${process.env.USER_TABLE}]`)
    const resp = await DynamoDB.get({
        TableName: process.env.USER_TABLE,
        Key: {
            id
        }
    }).promise()

    expect(resp.Item).toBeTruthy()

    return resp.Item
}

const tweetsCount_is_updated_in_UsersTable = async (id, newCount) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient()

    console.log(`looking for user [${id}] in table [${process.env.USER_TABLE}]`)
    const resp = await DynamoDB.get({
        TableName: process.env.USER_TABLE,
        Key: {
            id
        }
    }).promise()

    expect(resp.Item).toBeTruthy()
    expect(resp.Item.tweetsCount).toEqual(newCount)

    return resp.Item
}

const tweet_exists_in_TweetsTable = async (id) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient()

    const tableName = process.env.TWEETS_TABLE
    console.log(`looking for tweet [${id}] in table [${tableName}]`)
    const resp = await DynamoDB.get({
        TableName: tableName,
        Key: {
            id
        }
    }).promise()

    expect(resp.Item).toBeTruthy()

    return resp.Item
}

const tweet_exists_in_TimelinesTable = async (userId, tweetId) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient()

    const tableName = process.env.TIMELINES_TABLE
    console.log(`looking for tweet [${tweetId}] for user [${userId}] in table [${tableName}]`)
    const resp = await DynamoDB.get({
        TableName: tableName,
        Key: {
            userId,
            tweetId
        }
    }).promise()

    expect(resp.Item).toBeTruthy()

    return resp.Item
}

const user_can_upload_image_to_url = async (url, filePath, contentType) => {
    const data = fs.readFileSync(filePath)
    await http({
        method: 'put',
        url,
        headers: {
            'Content-Type': contentType
        },
        data
    })

    console.log('uploaded image to', url)
}

const user_can_download_image_from = async (url) => {
    const resp = await http(url)

    console.log('downloaded image from', url)

    return resp.data
}

module.exports = {
    user_exists_in_UsersTable,
    tweetsCount_is_updated_in_UsersTable,
    tweet_exists_in_TweetsTable,
    tweet_exists_in_TimelinesTable,
    user_can_upload_image_to_url,
    user_can_download_image_from
}