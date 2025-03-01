

function select_image(event){

    let e = event.target

    const offset = 0
    let link = e.src
    
    link = link.split("&sz=w")[0]
    link += `&sz=w${5200}`
    let selected_image_element = document.getElementsByClassName("selected-image")[0]

    selected_image_element.src = link
    
    let holder = document.getElementsByClassName("selected-image-holder")[0]
    holder.style.display = "flex";

    let width = holder.offsetWidth
    let new_height = holder.offsetHeight
    let new_width = e.naturalWidth*(new_height/e.naturalHeight)
    if(new_width > (width+offset)){
        new_width = width-offset
        new_height = e.naturalHeight*(new_width/e.naturalWidth)
    }
    


    selected_image_element.width = new_width
    selected_image_element.height = new_height


    

}


function close_selected(){
    if(document.fullscreenElement){closeFullscreen()}
    let container = document.getElementsByClassName("selected-image-holder")[0]
    document.getElementsByClassName("selected-image")[0].src = ""
    if(container.style.display == "flex"){container.style.display="none"}
    
}

let screen_state = "normal"

function full_screen_select(){
    console.log("changing screen state")
    let btn = document.getElementById("change_screen_state_img");
    if(screen_state == "normal"){
        screen_state = "fullscreen"
        btn.src = "assets/exit-fullscreen.svg"
        openFullscreen(document.getElementsByClassName("selected-image-holder")[0])
        recalculate_img_size()
    } else{
        
        screen_state = "normal"
        btn.src = "assets/expand-fullscreen.svg"
        closeFullscreen()
    }
}
document.getElementsByClassName("selected-image-holder")[0].addEventListener("fullscreenchange",(event) =>{
    if(document.fullscreenElement){return}
    let btn = document.getElementById("change_screen_state_img");
    screen_state="normal"    
    btn.src = "assets/expand-fullscreen.svg"
    closeFullscreen()
    recalculate_img_size()
})


function recalculate_img_size(){
    let selected_image_element = document.getElementsByClassName("selected-image")[0]
    let holder = document.getElementsByClassName("selected-image-holder")[0]
  
    
    let width =screen.width;
    let new_height = screen.height
    let new_width = selected_image_element.naturalWidth*(new_height/selected_image_element.naturalHeight)
    if(new_width > (width)){
        new_width = width
        new_height = selected_image_element.naturalHeight*(new_width/selected_image_element.naturalWidth)
    }


    selected_image_element.width = new_width
    selected_image_element.height = new_height


}

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
}
function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
  }


function create_child_tag_array(parent_tag){
  let child_array = []
  for(const child of TAG_RELATIONSHIPS[parent_tag]){
    child_array += create_child_tag_array(child) + [child]
  }
  return child_array
}


function addNewTagFilter(tag,filter_type){

  TagFilterSettings["exclude"] =  TagFilterSettings["exclude"].filter(item => item !== tag);
  TagFilterSettings["include"] =  TagFilterSettings["include"].filter(item => item !== tag);
  if(filter_type == "exclude"){
  
    TagFilterSettings["exclude"].push(tag)
  }else if(filter_type == "include"){
    
    TagFilterSettings["include"].push(tag)
  }
}


function display_tags(tag_list,container){
  container.innerHTML = ""
  for(const child_tag of tag_list){
    let tag_state = "normal"
    if(TagFilterSettings["exclude"].includes(child_tag)){tag_state="exclude"}
    if(TagFilterSettings["include"].includes(child_tag)){tag_state="include"}
    let html_text = `<div class="tag-option">
                    <img class = "tag-state-img ${tag_state}"  onclick="change_tag_state(this)" style="cursor: pointer;" width="10px" height= "10px"src="assets/${tag_state}.svg">
                    <span class = "tag-span" onclick="change_tag_state(this)" style="cursor: pointer;user-select: none;">${child_tag}</span>
                    <button onclick="dive_tag(this)" class="dive-tag-btn"><img width="10px" height= "10px"src="assets/retrace-tag.svg" style="transform: rotate(90deg);"></button>
                </div>`
    container.innerHTML += html_text
  }
}


let root_tag = "root"
//TODO implement
function open_tag_select(){
  let root_title = document.getElementById("current-root-tag")
  let container = document.getElementsByClassName("tag-container")[0]
  let blackout = document.getElementById("tag-select-blackout");
  let retrace_btn = document.getElementById("retrace-root-tag")
  retrace_btn.style.display = "none"
  
  blackout.style.display = 'flex'
  root_title.innerHTML = root_tag
  root_tag = "root"

  display_tags(TAG_RELATIONSHIPS[root_tag],container)
}
function close_tag_select(){
  document.getElementById("tag-select-blackout").style.display = "none"
}

function get_nested_tag_images(tag){
  
  let final_array = []
  for(const child_tag of TAG_RELATIONSHIPS[tag]){
    let images = get_nested_tag_images(child_tag)
    final_array = final_array.concat(images)
    
  }
  return final_array.concat(DE_NESTED_TAG_IMG_RELATIONSHIP[tag])
}

function get_filterd_image_list(){
  //TODO Change to include tag children aswell 
  console.log(TagFilterSettings)
  let includedID = new Set()
  console.log(TAG_RELATIONSHIPS)
  console.log("creating filter")
  for(const includeTag of TagFilterSettings["include"]){
    console.log(`processing tag ${includeTag}`)
    for(const imageID of get_nested_tag_images(includeTag)){
      
      includedID.add(imageID)
      console.log(imageID)
    }
  }
  console.log(includedID)
  if(includedID.size == 0){
    includedID = new Set(TAGGED_FILES)
  }
  let excludedID = new Set()
  for(const excludeTag of TagFilterSettings["exclude"]){
    for(const imageID of get_nested_tag_images(excludeTag)){
      excludedID.add(imageID)
    }
  }
  return includedID.difference(excludedID )
}

function refresh_images(){
  document.getElementsByClassName("img-container-holder")[0].innerHTML = ""
  for(const image of get_filterd_image_list()){
    load_image(image)
  }

}

let tag_dive_path = ["root"]

function retrace_tag(e){
  tag_dive_path.pop()
  let root_title = document.getElementById("current-root-tag")
  root_title.innerHTML = tag_dive_path[tag_dive_path.length-1]
  if(root_title.innerHTML == root_tag){
    document.getElementById("retrace-root-tag").style.display = "none"
  }
  display_tags(TAG_RELATIONSHIPS[tag_dive_path[tag_dive_path.length-1]], document.getElementsByClassName("tag-container")[0])
}

function dive_tag(e){
  let retrace_btn = document.getElementById("retrace-root-tag")
  retrace_btn.style.display = "flex"
  let root_title = document.getElementById("current-root-tag")
  //clear holder
  let container = document.getElementsByClassName("tag-container")[0]
  
  let tag = e.parentNode.children[1].innerHTML
  root_title.innerHTML = tag
  tag_dive_path.push(tag)

  let top_level_child_tags = TAG_RELATIONSHIPS[tag]

  //generate tag option
  display_tags(top_level_child_tags,container)
}

function change_tag_state(e){
  let tag = null
  if(e.classList.contains("tag-state-img")){
    let parent = e.parentNode;
    tag = parent.children[1].innerHTML;
  }else{
    //the span was clicked
    tag = e.innerHTML
 
    e = e.parentNode.children[0]
  }

  if(e.classList.contains("normal")){
    //change to include
    addNewTagFilter(tag,"include");
    e.src = "assets/include.svg";
    e.classList.add("include")
    e.classList.remove("normal")

  }else if(e.classList.contains("include")){
    //change to exclude
    addNewTagFilter(tag,"exclude");
    e.src = "assets/exclude.svg";
    e.classList.remove("include")
    e.classList.add("exclude")

  }else if(e.classList.contains("exclude")){
    //change to normal
    addNewTagFilter(tag,"normal");
    e.src = "assets/normal.svg";
    e.classList.remove("exclude")
    e.classList.add("normal")
  }

  refresh_images()
}