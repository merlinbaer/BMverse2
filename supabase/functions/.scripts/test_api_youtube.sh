#!/bin/zsh

# video part:
# contentDetails
# fileDetails (owner only)
# id (minimum repsonse, always returned, no need to include in part parameter)
# liveStreamingDetails (not needed)
# localizations (not needed)
# paidProductPlacementDetails (not needed)
# player (not needed)
# processingDetails (owner only)
# recordingDetails (not needed)
# snippet 
# statistics 
# status (not needed)
## suggestions (owner only)
# topicDetails (not needed)

# channel part (mostly for owner, ownly snippet for ):
## auditDetails
## brandingSettings
## contentDetails
## contentOwnerDetails
## id (minimum repsonse, always returned, no need to include in part parameter)
## localizations
## snippet
## statistics
## status
## topicDetails



# test video id: hXNR9Wi9Adk,rt9bEzh5r-Y
# test channel id: UC33_tIj4m1_XaqfFcomShvw

# get youtube video info (or many youtube videos with comma seperated list of id)
# part id,contentDetails,snippet,statistics 
curl -v "https://www.googleapis.com/youtube/v3/videos?id=hXNR9Wi9Adk,rt9bEzh5r-Y&key=1234&part=id,contentDetails,snippet,statistics"


# get youtube channel info
# part id,snippet 
# curl -v "https://www.googleapis.com/youtube/v3/channels?id=UC33_tIj4m1_XaqfFcomShvw&key=1234&part=id,snippet"
