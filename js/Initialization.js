const INIT_FUNCTION_CALL_ORDER = [get_taged_files,load_config,get_initial_images,generate_tag_relationships]
//https://www.googleapis.com/drive/v3/files?pageSize=${CONFIG_DETAILS["initial-image-loaded-number"]}&q='${FOLDER_ID}'+in+parents&key=${API_KEY}
//TO KEEP MY SANITY THERE CAN ONLY BE 1 OF ANY TAG. even if a tag is a child of another tag it cannot share a name with any other tag
//TODO fix this shit
//root cannot be a tag
function generate_nested_tags_tag_relationship(tag_dic,parent_tag){
    console.log(parent_tag)
    console.log(tag_dic["children"])
    let return_dic = {}
    let child_list = []
    for(const tag of Object.keys(tag_dic["children"])){
 
        child_list.push(tag)
        if(tag_dic["children"][tag]["children"] == []){continue}
        return_dic = { ...return_dic, ...generate_nested_tags_tag_relationship(tag_dic["children"][tag],tag)};
    }
    let dic = {};
    dic[parent_tag] = child_list;
    return { ...return_dic, ...dic}
    
}
async function get_taged_files(){
    const response = await fetch(data_folder_url+"tagged_files.json ")
    console.log(response)
    let data = await response.json()
    console.log(data)
    for(const file_id of data["files"]){
        TAGGED_FILES.push(file_id)
    }

    console.log("finished loading tagged files")
    
}
async function generate_tag_relationships(){
    const response = await fetch(data_folder_url+"tags.json")
    let data = await response.json()
    console.log(data)
    let root_children = []
    for(const top_level_tag of Object.keys(data)){
        TAG_RELATIONSHIPS= {...TAG_RELATIONSHIPS, ...generate_nested_tags_tag_relationship(data[top_level_tag],top_level_tag)}
        root_children.push(top_level_tag)
    }
    TAG_RELATIONSHIPS= {...TAG_RELATIONSHIPS, ...{"root":root_children}}
    
    generate_de_nested_tag_image_relationships(data)
    console.log(DE_NESTED_TAG_IMG_RELATIONSHIP)
    console.log("Tag relationships generated")
}


function generate_de_nested_tag_image_relationships(data){
 
    console.log(data)
    for(const key of Object.keys(data)){
        generate_de_nested_tag_image_relationships(data[key]["children"])
        let new_dic = {}
        new_dic[key] = data[key]["content"]
        DE_NESTED_TAG_IMG_RELATIONSHIP = {...DE_NESTED_TAG_IMG_RELATIONSHIP, ...new_dic}
    }
}

//by default does not support nested folders
async function load_image(image_id) {
    let image_url = FileURL+image_id+FileExportData
    let NewImage = new Image()
    NewImage.src = image_url
    NewImage.classList.add("img-container")
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
    let images_to_load = TAGGED_FILES.length
    if(CONFIG_DETAILS["initial-image-loaded-number"] < TAGGED_FILES.length){
        images_to_load = CONFIG_DETAILS["inital-image-loaded-number"]
    }
    for(let i =0;i<images_to_load;i++){
        load_image(TAGGED_FILES[i])
    }

}

async function load_config(){
    let response = await fetch(config_url)
    let data = await response.json()
    CONFIG_DETAILS = data
    console.log(CONFIG_DETAILS)
    console.log(data)
    console.log("finished loading config")
 
}
async function InitializeCatalog() {
    for(const func of INIT_FUNCTION_CALL_ORDER){
        await func()
    }

}

InitializeCatalog()


