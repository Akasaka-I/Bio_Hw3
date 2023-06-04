import base64
import logomaker as lm
from io import BytesIO
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import matplotlib.pyplot as plt
plt.ion()

app = Flask(__name__)
app.static_folder = 'static'
CORS(app)


@app.route('/process_sequence', methods=['POST'])
def process_sequence():    
    sequences = request.json['sequences']
    counts_mat = lm.alignment_to_matrix(sequences)
    logo = lm.Logo(counts_mat,color_scheme='weblogo_protein',figsize=(18,3))
    logo_image = BytesIO()
    logo.fig.savefig(logo_image,format='png')
    logo_image.seek(0)
    logo_data = base64.b64encode(logo_image.getvalue()).decode('utf-8')
    return jsonify(logo_data)

@app.route('/index.html')
def index():
    return make_response(open('index.html').read())
@app.route('/styles.css')
def styles():
    return make_response(open('styles.css').read())
@app.route('/script.js')
def script():
    return make_response(open('script.js').read())

if __name__ == '__main__':
    app.run()
