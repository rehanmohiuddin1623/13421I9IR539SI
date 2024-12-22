import SwiftUI

enum stickerType {
case IMAGE
case TEXT
}

struct Sticker: Identifiable {
  var id = UUID()
  @State var name:String;
  var position:CGPoint;
  var type :stickerType;
}

struct MySwiftUIScreen: View {
    @State private var shapes: [Sticker] = [] // Store all shapes
    @State private var selectedShapeIndex: Int? = nil // Track selected shape
    @State private var isCameraPresented = false
    @State private var capturedImage: UIImage?
    @State private var imageToShow: UIImage? = nil // State for displaying saved image
  @State private var isImageBuilding = false;
  let loader = LoaderView()
  @State private var isTextFieldFocused = false;
  @State private var textCaption = ""

    
  let Stickers = ["Amazed Pizza Guy",
                  "Flower-Doughtnut Plant",
                  "Grumpy Smoker",
                  "One Eyed UFO",
                  "Wanda The Sausage"]
    var callback: () -> Void

    var body: some View {
      HStack {
          Button(action: {
              triggerCallback() // Dismiss the current view
          }) {
              Image(systemName: "arrow.left.circle.fill")
                  .font(.system(size: 20))
                  .foregroundColor(.black)
                  .frame(width: 40, height: 40)
                  .background(Color.white.opacity(0.8))
                  .clipShape(Circle())
                  .shadow(radius: 10)
          }
          .padding(.leading, 10)
        Spacer()
        HStack {
          Button(action: {
            isTextFieldFocused = true;
          }) {
              Image("text-icon-1x")
                  .font(.system(size: 20))
                  .foregroundColor(.black)
                  .frame(width: 40, height: 40)
                  .background(Color.white.opacity(0.8))
                  .clipShape(Circle())
                  .shadow(radius: 10)
          }
          .padding(.leading, 10)
          .padding(.trailing,10)
          .disabled(!(imageToShow===nil))
          
          Button(action: {
            isImageBuilding = true
            DispatchQueue.global().async{
              let imageURL = captureAndSaveImage(image: capturedImage!, filename: "output")
               print("File Saved At \(String(describing: imageURL))")
               imageToShow = UIImage(contentsOfFile: imageURL!.path)
              isImageBuilding = false;
            }
          }) {
              Image(systemName: "checkmark.circle.fill")
                  .font(.system(size: 20))
                  .foregroundColor(.black)
                  .frame(width: 40, height: 40)
                  .background(Color.white.opacity(0.8))
                  .clipShape(Circle())
                  .shadow(radius: 10)
          }
          .padding(.leading, 10)
          .padding(.trailing,10)
          .disabled(!(imageToShow===nil))
        }
      }
      .frame(height: 40)
      .frame(maxWidth: .infinity, alignment: .leading)
      .background(Color.clear)
        GeometryReader { geometry in
            VStack {
              if (isImageBuilding == true) {
                LoaderView(loaderMessage: "Processing Image...")
                    .padding(20)
              }
              else if let imageToShow = imageToShow {
                           Image(uiImage: imageToShow)
                               .resizable()
                               .scaledToFit()
                               .frame(maxWidth: geometry.size.width, maxHeight: geometry.size.height * 1)
                               .padding()
                if ShareInstagram.canOpenInstagramStories {
                   Button(action: {
                     DispatchQueue.global().sync {
                       ShareInstagram.shareToInstagramStories(imageToShow)
                     }
                   }) {
                     Text("Share to Instagram Stories".uppercased())
                       .foregroundColor(.black)
                       .font(.caption)
                     Image("instagram-icon")
                       .resizable()
                       .scaledToFit()
                       .frame(width: 25,height: 25)
                   }
                   .padding(10)
                   .cornerRadius(10)        // Rounded corners
                   .overlay(
                       RoundedRectangle(cornerRadius: 10)
                           .stroke(Color.black, lineWidth: 1) // Black border
                   )
                   .background(.white)
                   .shadow(color: Color.black.opacity(0.25), radius: 10, x: 0, y: 5)
                   .frame(width: .infinity,height: 50)
                  
                 } else {
                   Text("Instagram is not available.")
                 }
                       }
              else {
                if #available(iOS 17.0, *) {
                  ZStack {
 
                   if let capturedImage = capturedImage {
                      // Display captured image with shapes overlay
                      Image(uiImage: capturedImage)
                        .resizable()
                        .scaledToFit()
                        .frame(maxWidth: geometry.size.width, maxHeight: geometry.size.height * 1)
                        .overlay(
                          ZStack {
                            ForEach(shapes.indices, id: \.self) { index in
                              let sticker = shapes[index]
                              VStack {
                                if sticker.type == .IMAGE {
                                  shapeView(sticker.name)
                                } else if sticker.type == .TEXT {
                                  Text(sticker.name)
                                    .textFieldStyle(RoundedBorderTextFieldStyle())
                                    .foregroundColor(.white)
                                    .font(.caption)
                                    .fontDesign(.monospaced)
                                    .fontWeight(.semibold)
                                    .padding(10)
                                    .background(.black)
                                  
                                }
                              }
                              .position(sticker.position)
                              .gesture(
                                DragGesture()
                                  .onChanged { value in
                                    print("On Change...")
                                    // Move the shape as the user drags
                                    shapes[index].position = value.location
                                  }
                                  .onEnded { value in
                                    print("On Ended... \(value.location)")
                                    selectedShapeIndex = index // Select the shape on drag end
                                    shapes[index].position = value.location
                                  }
                              )
                              .onTapGesture { value in
                                selectedShapeIndex = index // Select shape on tap
                                shapes[index].position.x = value.x
                                shapes[index].position.y = value.y
                              }
                            }
                          }
                        )
                        .overlay(
                          VStack {
                            if(isTextFieldFocused == true){
                              VStack {
                                TextField("",text:$textCaption)
                                  .frame(maxWidth: .infinity)
                                  .onSubmit {
                                    isTextFieldFocused = false
                                    addText(name: textCaption)
                                  }
                              }
                              .background(Color.black.opacity(0.4))
                            }
                          }
                            .frame(width: .infinity, height: 200)
                        )
                    } else {
                      // Display camera prompt
                      
                      Button(action: {
                        isCameraPresented = true
                      }) {
                        Text("Open Camera")
                          .padding()
                          .foregroundColor(.white)
                          .background(Color.black)
                          .cornerRadius(10)
                      }
                    }
                  }
                  .frame(maxWidth: geometry.size.width, maxHeight: geometry.size.height * 0.85)
                  //                .onTapGesture { location in
                  //                  addShape(at: location)
                  //                }
                } else {
                  // Fallback on earlier versions
                }
                
                VStack {
                  // Bottom toolbar for shape actions
                  HStack {
                    
                    
                    ForEach(Stickers.indices,id:\.self){
                      index in
                      let imageName = Stickers[index]
                      Button(action: {
                        addSticker(name: imageName)
                      }) {
                        Image(imageName)
                          .resizable()
                          .scaledToFit()
                          .frame(maxWidth:50,maxHeight: 50)
                      }
                      Spacer()
                    }
                  }
                  .padding()
                  .background(Color.gray.opacity(0.1))
                }
              }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .onAppear {
                checkCameraPermission()
                isCameraPresented = true
            }
            .sheet(isPresented: $isCameraPresented) {
                CameraView(image: $capturedImage)
            }
        }
    }

    private func triggerCallback() {
        callback()
    }

    /// View for each shape (rectangle, circle, etc.)
    @ViewBuilder
    private func shapeView(_ shape: String) -> some View {
      Image(shape)
        .resizable()
        .scaledToFit()
        .frame(maxWidth:100,maxHeight: 100)
        .accessibilityLabel(shape)
    }

    /// Adds a new rectangle at a default position
  private func addSticker(name:String) {
    shapes.append(Sticker(name:name, position: CGPoint(x: 100, y: 100),type:.IMAGE))
    }
  
  private func addText(name:String) {
    shapes.append(Sticker(name:name, position: CGPoint(x: 100, y: 100),type:.TEXT))
    }
  

  
  func openImageDirectly(fileURL: URL, viewController: UIViewController) {
      if let image = UIImage(contentsOfFile: fileURL.path) {
          // Display the image directly
          let imageView = UIImageView(image: image)
          imageView.frame = viewController.view.bounds
          imageView.contentMode = .scaleAspectFit
          viewController.view.addSubview(imageView)
      } else {
          print("Failed to load image.")
      }
  }
  
  func mapPointToImage(point: CGPoint, fromViewSize: CGSize, imageSize: CGSize) -> CGPoint {
    let xScale = imageSize.width / fromViewSize.width
       let yScale = imageSize.height / fromViewSize.height
       
       print("xScale: \(xScale), yScale: \(yScale)") // Debug scales

       return CGPoint(x: point.x * xScale, y: point.y * yScale)
    
  }

  
  private func captureAndSaveImage(image: UIImage, filename: String) -> URL? {
    let renderer = UIGraphicsImageRenderer(size: image.size)
    let combinedImage = renderer.image { context in
        // Draw the captured image
        image.draw(at: CGPoint(x: 0, y: 0))
      
      print("Stickers Size \(shapes.count)")

        // Overlay the stickers on top
      for sticker in shapes {
        
        
        let fromViewSize = CGSize(width: 300, height: 400)
        let imageSize = CGSize(width: 1800, height: 2000)
        let point = sticker.position

        let stickerPosition = mapPointToImage(point: point, fromViewSize: fromViewSize, imageSize: imageSize)

        let rect = CGRect(origin: stickerPosition, size: CGSize(width: 500, height: 700))
          
            if let childImage = UIImage(named: sticker.name) {
                print("Drawing sticker: \(sticker.name) at \(rect)")
                childImage.draw(in: rect)  // Draw child image at specified position
                
            } else {
                print("Failed to load image for sticker: \(sticker.name)")
              print("Drawing Text : \(sticker.name)")
              let text = sticker.name
              let textAttributes: [NSAttributedString.Key: Any] = [
                  .foregroundColor: UIColor.white,
                  .font: UIFont.monospacedSystemFont(ofSize: 100, weight: .bold),
                  .backgroundColor:UIColor.black
              ]
              
              text.draw(in: rect.insetBy(dx: 25, dy: 25), withAttributes: textAttributes)
            }
      }
    }

    return saveImageToCache(image: combinedImage, filename: filename)
  }
  
  private func saveImageToCache(image: UIImage, filename: String) -> URL? {
      let fileManager = FileManager.default
      if let cacheDirectory = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first {
          let fileURL = cacheDirectory.appendingPathComponent(filename)
          if let imageData = image.pngData() {
              do {
                  try imageData.write(to: fileURL)
                  return fileURL
              } catch {
                  print("Error saving image: \(error)")
              }
          }
      }
      return nil
  }


    /// Adds a new shape at the tap location
//    private func addShape(at location: CGPoint) {
//        shapes.append(DrawableShape(type: .rectangle, position: location)) // Default to rectangle
//    }

    /// Deletes the selected shape
    private func deleteSelectedShape() {
        if let index = selectedShapeIndex {
            shapes.remove(at: index)
            selectedShapeIndex = nil
        }
    }
}

/// Model for each drawable shape
struct DrawableShape: Identifiable {
    let id = UUID()
    var type: ShapeType
    var position: CGPoint
    var size: CGSize = CGSize(width: 100, height: 100) // Default size
    var color: Color = Color.red // Default color
}

/// Enum for shape types
enum ShapeType {
    case rectangle, circle
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        MySwiftUIScreen(callback: {})
            .previewLayout(.sizeThatFits)
    }
}

