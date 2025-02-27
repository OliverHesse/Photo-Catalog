const INIT_FUNCTION_CALL_ORDER = [load_config,get_initial_images]


//by default does not support nested folders
async function load_image(image_data) {
    let image_url = FileURL+image_data.id+FileExportData
    let NewImage = new Image()
    NewImage.src = image_url

    NewImage.onload = function()
    {
        let origin_height = NewImage.naturalHeight;
        let origin_width = NewImage.naturalWidth;
        NewImage.height = CONFIG_DETAILS["img-height-default"]
        NewImage.width = (origin_width)*(CONFIG_DETAILS["img-height-default"]/origin_height)
        document.getElementsByClassName("img-container-holder")[0].appendChild(NewImage)
        console.log("image_loaded")
        
    }

    
}

async function get_initial_images(){
    console.log("Loading Images")
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?pageSize=${CONFIG_DETAILS["initial-image-loaded-number"]}&q='${FOLDER_ID}'+in+parents&key=${API_KEY}`)
    const data = await response.json();

    for(const image of data.files){
        load_image(image)
    }
}

async function load_config(){
    response = await fetch(config_url)
    data = await response.json()
    CONFIG_DETAILS = data
    console.log(data)
    console.log("finished loading config")
 
}
async function InitializeCatalog() {
    for(const func of INIT_FUNCTION_CALL_ORDER){
        await func()
    }

}

InitializeCatalog()


