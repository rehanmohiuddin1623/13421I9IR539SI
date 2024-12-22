class ImageOverlayView: UIView {
    var backgroundImage: UIImage?
    var stickers: [Sticker] = [] // Assuming Sticker is a model with 'name' and 'position' properties

    override func draw(_ rect: CGRect) {
        super.draw(rect)

        // Draw the background image
        backgroundImage?.draw(in: rect)

        // Overlay stickers on top
        for sticker in stickers {
            if let childImage = UIImage(named: sticker.name) {
                let rect = CGRect(origin: sticker.position, size: childImage.size)
                childImage.draw(in: rect)  // Draw child image at specified position
            }
        }
    }
}
