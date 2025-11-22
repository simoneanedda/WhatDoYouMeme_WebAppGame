function Meme(id, path) {
    this.id =id;
    this.path = path;
}

function Caption (id, text, memeID){
    this.id =id;
    this.text = text;
    this.memeID= memeID;
}

export {Meme, Caption}