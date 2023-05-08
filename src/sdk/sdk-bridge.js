function getIm() {
    if (window.imsdk !== undefined) {
        return {
            im: window.imsdk.im,
            im_webToolkit: window.imsdk.im_webToolkit
        }
    }
    throw new Error("Couldn't not fetch lim...")
}

const im = getIm().im

export default im