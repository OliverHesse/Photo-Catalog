const config_url = "https://oliverhesse.github.io/Photo-Catalog/config.json"
const INIT_FUNCTION_CALL_ORDER = [load_config,get_initial_images]
CONFIG_DETAILS = {}


async function get_initial_images(){
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?pageSize=${CONFIG_DETAILS["initial-image-loaded-number"]}&q='${FOLDER_ID}'+in+parents&key=${API_KEY}`)
    const data = await response.json();
    console.log(data.files)
}


async function load_config(){
    response = await fetch(config_url)
    data = await response.json()
    CONFIG_DETAILS = data
    console.log("finished loading config")
 
}
async function InitializeCatalog() {
    for(const func of INIT_FUNCTION_CALL_ORDER){
        await func()
    }

}

InitializeCatalog()


