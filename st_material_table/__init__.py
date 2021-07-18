import os
import pandas as pd
import streamlit.components.v1 as components

_RELEASE = True

if not _RELEASE:
    _custom_table = components.declare_component(
        "custom_table",
        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _custom_table = components.declare_component(
        "custom_table", path=build_dir)

# # Create a wrapper function for the component. This is an optional
# # best practice - we could simply expose the component function returned by
# # `declare_component` and call it done. The wrapper allows us to customize
# # our component's API: we can pre-process its input args, post-process its
# # output value, and add a docstring for users.


def st_material_table(data, key=None):
    return _custom_table(data=data, key=key, default=pd.DataFrame())


# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run my_component/__init__.py`
if not _RELEASE:
    import streamlit as st

    st.title('Streamlit Custom Material Table Test')

    course_df = pd.read_csv(st.secrets['db']['url'], index_col=0)

    # Create an instance of our component with a constant `name` arg, and
    # print its output value.
    _ = st_material_table(course_df)

    footer = """

<style>
footer {
    visibility: hidden;
}


.footer {
    clear: both;
    width: 100%;
    height: 2.5rem;
    border-top: 1px solid #f8f8f2A9;
    position: relative;
    bottom: 0;
    padding-top: 20px;
    left: 0px; 
    text-align: center; 
}

</style>


<div class="footer">
© Brian L. Chen (<a href="https://github.com/icheft">@icheft</a>)
</div>"""

    st.markdown(footer, unsafe_allow_html=True)
