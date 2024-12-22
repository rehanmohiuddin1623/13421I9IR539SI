import SwiftUI

struct LoaderView: View {
    @State private var moveToX: CGFloat = 0
    @State private var moveToY: CGFloat = 0
    @State private var currentStep = 0
  var loaderMessage = "";
    
    let boxSize: CGFloat = 50
  let moveBoxSize: CGFloat = 29
    
  let animationDuration: Double = 0.4
    
    var body: some View {
        ZStack {
            // Grey Boxes
            VStack {
                HStack {
                    Color.gray.frame(width: boxSize, height: boxSize)
                    Color.gray.frame(width: boxSize, height: boxSize)
                }
                HStack {
                    Color.gray.frame(width: boxSize, height: boxSize)
                    Color.gray.frame(width: boxSize, height: boxSize)
                }
            }
            
            // Black Box
            Rectangle()
                .fill(Color.black)
                .frame(width: boxSize, height: boxSize)
                .position(x: moveToX+25, y: moveToY+25)
                .offset(x: moveToX, y: moveToY)
                .onAppear {
                    startAnimation()
                }
                .animation(.easeInOut(duration: animationDuration), value: moveToX)
                .animation(.easeInOut(duration: animationDuration), value: moveToY)
          
            
        }
        .frame(width: 10,height: 10)
      Text(loaderMessage.uppercased())
        .font(.caption)
        .bold()
        .foregroundStyle(.black)
        .padding(.top,10)
    }
    
    func startAnimation() {
        // Repeat the animation steps
        Timer.scheduledTimer(withTimeInterval: animationDuration * 4, repeats: true) { _ in
            switch currentStep {
            case 0:
                moveToX += moveBoxSize
                currentStep = 1
            case 1:
                moveToY += moveBoxSize
                currentStep = 2
            case 2:
                moveToX -= moveBoxSize
                currentStep = 3
            case 3:
                moveToY -= moveBoxSize
                currentStep = 0
            default:
                break
            }
        }
    }
}


struct LoaderView_Previews: PreviewProvider {
    static var previews: some View {
        LoaderView()
            .previewLayout(.sizeThatFits)
    }
}
