import pickle
indices = pickle.load(open('models/indices.pkl', 'rb'))
print(list(indices.keys())[:10])
