
import os
import subprocess

def download_file(filename, output_dir='PlatePalsApp/'):
    file_map = {
        'top_rated.pkl': '1MNz1r-lFShjTHxL6aweP9bBq5MqioMiE',
        'feature_df.pkl': '1cmvVDeWrT_t5DwiMOMDvBhwyqMI2SzeZ',
    }
    file_id = file_map.get(filename)
    if file_id:
        command = f"gdown --output {output_dir}/{filename} https://drive.google.com/uc?id={file_id}"
        subprocess.run(command, shell=True)
    else:
        print(f"File '{filename}' not found in file_map.")

def file_check_or_download(path,name):
  if os.path.exists(path):
    print("File exists - ",name)
    return True
  else:
    download_file(name)
    return True

def download_files():
    # Your task code here
    print("Executing my task...")
    directory_path = os.path.dirname(os.path.abspath(__file__))
    # Example task: Creating initial data or triggering some background process
    filename2 = 'top_rated.pkl'
    filename3 = 'feature_df.pkl'
    file_path2 = os.path.join(directory_path, filename2)
    file_path3 = os.path.join(directory_path, filename3)
    fc2=file_check_or_download(file_path2,filename2)
    fc3=file_check_or_download(file_path3,filename3)
