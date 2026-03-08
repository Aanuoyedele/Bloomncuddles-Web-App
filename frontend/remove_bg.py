import cv2
import numpy as np
import sys

def remove_background(input_path, output_path):
    print(f"Processing {input_path}...")
    
    # Read the image with alpha channel if exists, else add one
    image = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    if image is None:
        print("Error reading image")
        sys.exit(1)
        
    if len(image.shape) == 3 and image.shape[2] == 3:
        # add alpha
        image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
        
    h, w = image.shape[:2]
    
    # Create a mask for floodfill
    # The mask needs to be 2 pixels wider and taller than the image
    mask = np.zeros((h + 2, w + 2), np.uint8)
    
    # Create a 3-channel version for floodfilling
    image_bgr = image[:, :, :3].copy()
    
    # Floodfill from top-left (0,0)
    flags = 4 | (255 << 8) | cv2.FLOODFILL_MASK_ONLY
    cv2.floodFill(image_bgr, mask, (0, 0), (255, 255, 255), (60, 60, 60), (60, 60, 60), flags)
    
    # The mask is now 255 where the background is.
    # Resize mask back to normal size
    bg_mask = mask[1:h+1, 1:w+1] == 255
    
    # Make background pixels transparent
    image[bg_mask] = [0, 0, 0, 0]
    
    # Save the result
    cv2.imwrite(output_path, image)
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    import sys
    # Hardcode for this exact task to avoid powershell space parsing issues
    input_file = "c:/Users/AANU/Desktop/Bloomncuddles website/frontend/public/kid-new.png"
    output_file = "c:/Users/AANU/Desktop/Bloomncuddles website/frontend/public/kid-new-nobg.png"
        
    remove_background(input_file, output_file)
