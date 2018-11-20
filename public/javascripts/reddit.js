var fragments;
var subreddit;
var item;
var after;
var imgContainer;

document.addEventListener("DOMContentLoaded", init);

function init(){
    imgContainer = document.getElementById('content');
    fragments = document.location.pathname.substr(3).split('/');
    subreddit = fragments[0] || null;
    item = fragments[1] || 1;
    after = fragments[2] || null;
    loadData(subreddit, item, after)
        .then(function(json){
            console.log(extractMedia(json, item));
            displayMedia(extractMedia(json, item));
        });
}

function displayMedia(media){
    console.log('display', media.title);
    if(media.media_embed){
        var embed = media.media_embed.content.replace(/height="(.*?)"/, '').replace(/width="(.*?)"/, '');
        imgContainer.innerHTML = embed;
    }else if(media.media){
        imgContainer.innerHTML = '<video controls autoplay><source src="' + media.media.reddit_video.fallback_url + '" type="video/mp4"></source></video>';
    }else if(media.url.indexOf('.gifv') > -1){
        var url = media.url.replace('.gifv', '.mp4');
        imgContainer.innerHTML = '<video controls autoplay><source src="' + url + '" type="video/mp4"></source></video>';
    }else{
        console.log('trying to load image', media.url);
        imgContainer.innerHTML = '<img src="' + media.url + '">';
    }
}

function extractMedia(list, itemNumber){
    var item = list.data.children[itemNumber];
    if(item.data.stickied === true){
        itemNumber++;
        return extractMedia(list, itemNumber);
    }
    if(item.data.crosspost_parent_list){
        return shrinkData(item.data.crosspost_parent_list[0]);
    }
    return shrinkData(item.data);
}

function shrinkData(item){
    return {
        url: item.url,
        preview: item.preview,
        media_embed: item.media_embed.content ? item.media_embed : null,
        media: item.media,
        title: item.title
    }
}

function loadData(subreddit, item, after){
    return fetch(getProxyUrl('https://www.reddit.com/r/' + subreddit))
        .then(result => result.json())
}

function getProxyUrl(url){
    return '/proxy?url=' + encodeURIComponent(url) + '.json?raw_json=1';
}

document.onkeydown = function(event) {
    if (!event)
        event = window.event;
    var key = event.key;
    if(['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].indexOf(key) > -1){
        if(key === 'ArrowRight'){
            nextUrl();
        }
        if(key === 'ArrowLeft'){
            prevUrl();
        }
        event.preventDefault();
    }
};

function nextUrl(){
    item++;
    reloadData();
}

function prevUrl(){
    item--;
    reloadData();
}

function reloadData(_url){
    var url = _url || buildUrl();
    if(_url && _url === buildUrl()){
        return;
    }
    history.pushState({}, null, url);
    socket.emit('new-url', url);
    init();
}

function buildUrl(){
    var elements = [];
    if(subreddit){
        elements.push(subreddit);
    }
    if(item){
        elements.push(item);
    }
    if(after){
        elements.push(after);
    }
    return '/r/' + elements.join('/')
}

newUrlListener = reloadData;