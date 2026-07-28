#!/bin/zsh

# Get BABYMETAL Artists ID
# curl -X GET --header "Authorization: Bearer <media_key>" 'https://api.music.apple.com/v1/catalog/us/search?term=babymetal&types=artists'
# Reponse: 477101776
# (JAM Project = 266646521)

# Get all Albums from BABYMETAL (Storefront US)
# curl -X GET --header "Authorization: Bearer <media_key>" 'https://api.music.apple.com/v1/catalog/jp/artists/477101776/albums'
# Response
# https://music.apple.com/us/album/babymetal/1565598414
# https://music.apple.com/jp/album/babymetal/814314109
# https://music.apple.com/us/album/metal-galaxy/1475662687
# https://music.apple.com/jp/album/metal-galaxy/1478087760
# https://music.apple.com/us/album/metal-resistance/1565401539
# https://music.apple.com/jp/album/metal-resistance/1083834486
# https://music.apple.com/us/album/the-other-one/1664467760
# https://music.apple.com/jp/album/the-other-one/1664684595
# https://music.apple.com/us/album/metal-forth/1807174668
# https://music.apple.com/jp/album/metal-forth/1807174668
# https://music.apple.com/jp/album/get-no-satisfied-feat-babymetal-single/1838294575

# GET all songs from a certain album
# curl -X GET --header "Authorization: Bearer <media_key>" 'https://api.music.apple.com/v1/catalog/us/albums/1807174668'
curl -X GET --header "Authorization: Bearer <media_key>" 'https://api.music.apple.com/v1/catalog/jp/albums/1664684595'

# Format data with  https://play.jqlang.org (preformat with https://jsonviewer.stack.hu)
# jq
#.data[].relationships.tracks.data[] | {
#    id, 
#    name: .attributes.name, 
#    trackNumber: .attributes.trackNumber,
#    preview: .attributes.previews[0].url,
#    url: .attributes.url,
#    albumName: .attributes.albumName,
#    artwork: .attributes.artwork.url,
#    url: .attributes.url,
#    bgColor: .attributes.artwork.bgColor,
#    textColor1: .attributes.artwork.textColor1,
#    textColor2: .attributes.artwork.textColor2,
#    textColor3: .attributes.artwork.textColor3,
#    textColor4: .attributes.artwork.textColor4 }


# Metadata from a song
# curl -X GET --header "Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IktKNlY5MkFCMjcifQ.eyJpc3MiOiIyVk5ESjdNR05EIiwiaWF0IjoxNzQ4ODc2NTMxLCJleHAiOjE3NjQ0Mjg1MzF9._Y7W4zP9LqTw7TOYfngBsXvMCgab92L8iFR-Y61Yaweqr7ELBbRZYkFqoHzjmJBMbrOI9BT77vEtBuv1M5zcaA" 'https://api.music.apple.com/v1/catalog/us/songs/1807175033'
