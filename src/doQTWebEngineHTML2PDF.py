import sys
from PyQt6 import QtCore, QtWidgets, QtWebEngineWidgets

# call this way,
# ```
# python ./doQTWebEngineHTML2PDF.py input.html output.pdf
# ```

inputfilepath = sys.argv[1]
outputfilepath = sys.argv[2]

print('inputfilepath: ' + inputfilepath)
print('outputfilepath: ' + outputfilepath)

## credit:
##   https://stackoverflow.com/questions/48454086/ \
##     how-to-save-an-html-page-to-pdf-in-pyqt5
app = QtWidgets.QApplication(sys.argv)
loader = QtWebEngineWidgets.QWebEngineView()
loader.setZoomFactor(1)
loader.page().pdfPrintingFinished.connect(
    lambda *args: end())

loader.load(QtCore.QUrl(inputfilepath))

# if loader.show() not called, pdf not generated
# if loader.close() not called, process hangs until close button
def emit_pdf(finished):
    loader.show()
    loader.page().printToPdf(outputfilepath)

def end():
    print('finished:', args)
    loader.close()
    
loader.loadFinished.connect(emit_pdf)

app.exec()
