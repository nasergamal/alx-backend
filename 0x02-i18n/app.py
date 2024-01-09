#!/usr/bin/env python3
''' flask app'''

from flask import Flask, render_template, request, g
from flask_babel import Babel, get_timezone, format_datetime
import pytz
from pytz import timezone
from pytz.exceptions import UnknownTimeZoneError
from datetime import datetime
users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config(object):
    '''flask config'''
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


def get_user():
    '''check if logged in and if user exists'''
    user = request.args.get('login_as')
    if user:
        try:
            return users.get(int(user))
        except ValueError:
            pass
    return None


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    '''get request locale'''
    lang = request.args.get('locale')
    if lang and lang in app.config['LANGUAGES']:
        return lang
    elif g.user and g.user.get('locale') in app.config['LANGUAGES']:
        return g.user.get('locale')
    elif request.headers.get('locale'):
        return request.headers.get('locale')

    return request.accept_languages.best_match(app.config['LANGUAGES'])


@babel.timezoneselector
def get_timezone():
    '''get request timezone'''
    timezone = request.args.get('timezone')
    if timezone:
        try:
            return pytz.timezone(timezone).zone
        except UnknownTimeZoneError:
            pass
    if g.user:
        try:
            return pytz.timezone(g.user.get('timezone')).zone
        except UnknownTimeZoneError:
            pass

    return app.config['BABEL_DEFAULT_TIMEZONE']


@app.before_request
def before_request():
    '''look for logged in query before other function execute'''
    g.user = get_user()


@app.route("/", strict_slashes=False)
def simple_html():
    '''simple flask app'''
    time = format_datetime(format='medium')
    return render_template("index.html", time=time)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
