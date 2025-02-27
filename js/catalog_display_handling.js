const config_url = "../config.json"


async function load_config(){
    response = await fetch(config_url)
    
    console.log(response.json())
}

load_config()
