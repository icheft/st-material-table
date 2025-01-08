<h1 align="center">
  <br>
  <a href="https://pypi.org/project/st-material-table/"><img src="https://em-content.zobj.net/source/twitter/408/classical-building_1f3db-fe0f.png" width="50"></a>
  <br>
  Streamlit Material-UI Table
  <br>
</h1>

<h4 align="center">Streamlit Custom Components in React.</h4>

<p align="center">
  <a href="https://pypi.org/project/st-material-table/">
    <img src="https://img.shields.io/pypi/v/st-material-table.svg?maxAge=3600"
         alt="View package on PyPI">
  </a>
</p>

<p align="center">
  <a href="#how-to-use">How to Use</a> •
  <a href="#contribution">Contributions</a>
</p>

I've read through [the documentation](https://docs.streamlit.io/en/stable/publish_streamlit_components.html) and searched through other amazing components shown [here](https://streamlit.io/components), but couldn't get exactly what I need. Just yet.

The ultimate goal is to replicate [those Material-UI tables](https://material-ui.com/components/tables/#custom-pagination-actions). 

## How to Use

```sh
pip install st-material-table
```

In your `app.py`:

```py
from st_material_table import st_material_table

_ = st_material_table(display_df)
```

That shall do! Currently, it doesn't support customization. It uses the default theming - [Dracula Theme](https://github.com/dracula/streamlit).

## Contributions

The project is set up under MIT license. Feel free to play around. 
