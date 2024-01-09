#!/usr/bin/python3
''' flask app'''

from flask import Flask, render_template, request
from flask_babel import Babel


class Config(object):
    '''flask config'''
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


def get_locale():
    return request.accept_languages.best_match(app.config['LANGUAGES'])


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app, locale_selector=get_locale)


@app.route("/", strict_slashes=False)
def simple_html():
    '''simple flask app'''
    return render_template("2-index.html")


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
