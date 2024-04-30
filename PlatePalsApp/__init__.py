def ready():
        from . import download_pkl
        download_pkl.download_files()
        
        
ready()