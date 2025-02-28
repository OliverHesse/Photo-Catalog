

function select_image(event){
    console.log(event)
    let e = event.target
    console.log(e)
    const offset = 0
    let link = e.src
    
    link = link.split("&sz=w")[0]
    link += `&sz=w${5200}`
    let selected_image_element = document.getElementsByClassName("selected-image")[0]

    selected_image_element.src = link
    
    let holder = document.getElementsByClassName("selected-image-holder")[0]
    holder.style.display = "flex";
    console.log(holder.offsetHeight)
    
    let width = holder.offsetWidth
    let new_height = holder.offsetHeight
    let new_width = e.naturalWidth*(new_height/e.naturalHeight)
    if(new_width > (width+offset)){
        new_width = width-offset
        new_height = e.naturalHeight*(new_width/e.naturalWidth)
    }
    
    console.log(new_height)
    console.log(new_width)

    selected_image_element.width = new_width
    selected_image_element.height = new_height


    

}


function close_selected(){
    if(document.fullscreenElement){closeFullscreen()}
    let container = document.getElementsByClassName("selected-image-holder")[0]

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
    console.log(screen.height)
    
    let width =screen.width;
    let new_height = screen.height
    let new_width = selected_image_element.naturalWidth*(new_height/selected_image_element.naturalHeight)
    if(new_width > (width)){
        new_width = width
        new_height = selected_image_element.naturalHeight*(new_width/selected_image_element.naturalWidth)
    }
    
    console.log(new_height)
    console.log(new_width)

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