jQuery('#getroot').click(function(){
    console.log('Clicked get root');
    
    return false;
});

function getUrl(url) {

    $.ajax({
        url: url,
        type: "GET",
        contentType: "text/plain",
        // data: JSON.stringify({ user: user, pwd:pwd}),
        // data:'balbalbla',
        success: function (data, textStatus, jqXHR) {
            console.log(arguments);
            // do something with your data here.
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error', arguments);
            // likewise do something with your error here.
        }
    });
    
}