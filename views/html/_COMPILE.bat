call rename assets\css assets\_css
call harp compile
call rename assets\_css assets\css
call lessc assets\css\layout.less www\assets\css\layout.css
call lessc assets\css\components.less www\assets\css\components.css
call lessc assets\css\responsive.less www\assets\css\responsive.css
call md www\assets\font
call xcopy assets\font www\assets\font /s/h/e/k/f/c
call md www\assets\less
call xcopy assets\less www\assets\less /s/h/e/k/f/c
call md www\assets\js
call xcopy assets\js www\assets\js /s/h/e/k/f/c
call md www\assets\images
call xcopy assets\images www\assets\images /s/h/e/k/f/c
call md www\assets\libs
call xcopy assets\libs www\assets\libs /s/h/e/k/f/c
call md www\assets\videos
call xcopy assets\videos www\assets\videos /s/h/e/k/f/c