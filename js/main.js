//TODO Add some network optimisation where an image DOM element is not removed/reloaded if it is already loaded
//TODO Add a load more butotn for when the user has more than a certain number of pictures

function select_image(event){

    let e = event.target
    //replace default width with bigger one
    //either make this a setting or find way to get the images native width for max detail
    let link = e.src.split("&sz=w")[0]+`&sz=w${5200}`
    
    let selected_image_element = document.getElementsByClassName("selected-image")[0]

    selected_image_element.src = link
    
    let holder = document.getElementsByClassName("selected-image-holder")[0]
    holder.style.display = "flex";

    let new_height = holder.offsetHeight
    let new_width = e.naturalWidth*(new_height/e.naturalHeight)
    
    //for very wide images
    if(new_width > (holder.offsetWidth)){
        new_width = holder.offsetWidth
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
    let new_height = screen.height
    let new_width = selected_image_element.naturalWidth*(new_height/selected_image_element.naturalHeight)
    //for wide images
    if(new_width > (screen.width)){
        new_width = screen.width
        new_height = selected_image_element.naturalHeight*(new_width/selected_image_element.naturalWidth)
    }

    selected_image_element.width = new_width
    selected_image_element.height = new_height
}

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { // Safari 
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE11 
      elem.msRequestFullscreen();
    }
}
function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari 
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE11 
      document.msExitFullscreen();
    }
  }

function addNewTagFilter(tag,filter_type){
  //remove it from filter list
  TagFilterSettings["exclude"] =  TagFilterSettings["exclude"].filter(item => item !== tag);
  TagFilterSettings["include"] =  TagFilterSettings["include"].filter(item => item !== tag);
  //add back in with new filter
  if(filter_type == "exclude"){TagFilterSettings["exclude"].push(tag)}
  else if(filter_type == "include"){TagFilterSettings["include"].push(tag)}
}


function display_tags(tag_list,container){
  container.innerHTML = ""
  for(const child_tag of tag_list){
    let tag_state = "normal"
    if(TagFilterSettings["exclude"].includes(child_tag)){tag_state="exclude"}
    if(TagFilterSettings["include"].includes(child_tag)){tag_state="include"}
    let html_text = `
                <div class="tag-option">
                    <img class = "tag-state-img ${tag_state}"  onclick="change_tag_state(this)" style="cursor: pointer;" width="10px" height= "10px"src="assets/${tag_state}.svg">
                    <span class = "tag-span" onclick="change_tag_state(this)" style="cursor: pointer;user-select: none;">${child_tag}</span>
                    <button onclick="dive_tag(this)" class="dive-tag-btn"><img width="10px" height= "10px"src="assets/retrace-tag.svg" style="transform: rotate(90deg);"></button>
                </div>`
    container.innerHTML += html_text
  }
}

function open_tag_select(){
  document.getElementById("current-root-tag").innerHTML = root_tag
  document.getElementById("retrace-root-tag").style.display = "none"
  document.getElementById("tag-select-blackout").style.display = 'flex'

  display_tags(TAG_RELATIONSHIPS[root_tag],document.getElementsByClassName("tag-container")[0])
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

function get_filterd_images(){

  let includedID = new Set()

  for(const includeTag of TagFilterSettings["include"]){
    for(const imageID of get_nested_tag_images(includeTag)){      
      includedID.add(imageID)
    }
  }

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
  for(const image of get_filterd_images()){
    load_image(image)
  }

}

let tag_dive_path = [root_tag]

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
  document.getElementById("retrace-root-tag").style.display = "flex"

  let tag = e.parentNode.children[1].innerHTML
  document.getElementById("current-root-tag").innerHTML = tag

  tag_dive_path.push(tag)

  //generate tag option
  display_tags( TAG_RELATIONSHIPS[tag],document.getElementsByClassName("tag-container")[0])
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


function remove_filter_tag(e){
  let parent = e.parentNode;
  let tag = parent.firstChild.innerHTML
  TagFilterSettings["exclude"] =  TagFilterSettings["exclude"].filter(item => item !== tag);
  TagFilterSettings["include"] =  TagFilterSettings["include"].filter(item => item !== tag);
  document.getElementsByClassName("tag-filter-container")[0].removeChild(parent)
  refresh_images()
}

function open_view_tags(){
  document.getElementById("tag-view-blackout").style.display = "flex"
  let html = ""
  for(const tag of TagFilterSettings["include"]){
    html += `
        <div class="filterd-tag filterd-included"><span>${tag}</span><button onclick="remove_filter_tag(this)" class="remove-tag-filter-btn"><img src="assets/close_black.svg" width="10px"height="10px"></button></div>
    `
  }
  for(const tag of TagFilterSettings["exclude"]){
    html += `
    <div class="filterd-tag filterd-excluded"><span>${tag}</span><button onclick="remove_filter_tag(this)" class="remove-tag-filter-btn"><img src="assets/close_black.svg" width="10px"height="10px"></button></div>
`
  }
  document.getElementsByClassName("tag-filter-container")[0].innerHTML += html
}
function close_view_tags(){
  document.getElementById("tag-view-blackout").style.display = "none"
  document.getElementsByClassName("tag-filter-container").innerHTML = ""
}