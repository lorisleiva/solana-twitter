export class Tweet
{
    constructor (publicKey, accountData) {
        this.publicKey = publicKey
        this.author = accountData.author
        this.timestamp = accountData.timestamp.toString()
        this.topic = accountData.topic
        this.content = accountData.content
    }

    get key () {
        return this.publicKey.toBase58()
    }

    get author_display () {
        const author = this.author.toBase58()
        return author.slice(0,4) + '..' + author.slice(-4)
    }
}
