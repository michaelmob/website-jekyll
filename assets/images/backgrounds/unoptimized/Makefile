IM = mogrify
HEIGHT = 1920
WIDTH = 1080

FLAGS = -strip -sampling-factor 4:2:0 -quality 85 -interlace JPEG -colorspace RGB
SIZE = -resize $(HEIGHT)x$(WIDTH)^ -gravity center -crop $(HEIGHT)x$(WIDTH)+0+0 +repage
INPUT = *.jpg
OUTPUT = -path ../

build:
	$(IM) $(FLAGS) $(SIZE) $(OUTPUT) $(INPUT)
