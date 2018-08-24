# geekhub


# Example for stream description
data stream description;


hub subscribe AF123, ..
hub exec { video =>
 event.tranform(VIDEO_FORMAT=XY)
}
hub exec AF123 ALGO_VERBRECHER_DETECTION
hub exec { img  =>
 (img, "Einbrecher" 
}

