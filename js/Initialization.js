const INIT_FUNCTION_CALL_ORDER = [load_config,get_initial_images,generate_tag_relationships]
//TO KEEP MY SANITY THERE CAN ONLY BE 1 OF ANY TAG. even if a tag is a child of another tag it cannot share a name with any other tag
//TODO fix this shit
function generate_nested_tags_tag_relationship(tag_dic,parent_tag){
    let return_dic = {}
    let child_list = []
    for(const tag of tag_dic["children"]){
        child_list.push(child_tag)
        return_dic.update(generate_nested_tags_tag_relationship(data[top_level_tag]["children"][child_tag]))
    }
    return (return_dic.update({parent_tag,child_list}))
}

async function generate_tag_relationships(){
    let response = await fetch(data_folder_url+"tags.json")
    let data = response.json()
    console.log(data)
    for(const top_level_tag of data){
        let child_list = []
        for(const child_tag of data[top_level_tag]["children"]){
            child_list.push(child_tag)
            TAG_RELATIONSHIPS.update(generate_nested_tags_tag_relationship(data[top_level_tag]["children"][child_tag],child_tag))
            
        }
        TAG_RELATIONSHIPS.update({top_level_tag:child_list})
    }
    console.log(TAG_RELATIONSHIPS)
}
function generate_tag_image_relationships(){}

//by default does not support nested folders
async function load_image(image_data) {
    let image_url = FileURL+image_data.id+FileExportData
    let NewImage = new Image()
    NewImage.src = image_url
    NewImage.onclick = select_image
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
    let response = await fetch(config_url)
    let data = await response.json()
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


