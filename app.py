import time
import pandas as pd
import streamlit as st
from st_material_table import st_material_table
import numpy as np
import re
import argparse
import json


def _hash_st_secrets(secrets) -> int:
    """                                                                                                  
    An st.cache hash_func to hash st.secrets objects. The hash should change
    whenever the underyling secrets object changes.
    """
    hash_just_the_secrets = hash(json.dumps(st.secrets._secrets))
    return hash_just_the_secrets


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-l", "--local", help="Deploy your site locally", action="store_true")
    return parser.parse_args()


@st.cache(max_entries=10, ttl=3600, hash_funcs={type(st.secrets): _hash_st_secrets})
def read_df(local=False):
    if local:
        try:
            course_df = pd.read_csv('course.csv', index_col=0)
        except pd.errors.EmptyDataError:
            print('Local course.csv not found, please try `python run_app.py --force` to fetch all data available.')
    else:
        course_df = pd.read_csv(
            st.secrets['db']['url'], index_col=0)
    return course_df


def pre_processing(course_df):
    course_df['Time'] = course_df.Time.apply(lambda x: x.strip())
    course_df['Classroom'] = course_df.Classroom.apply(lambda x: x.strip())
    course_df['raw_day'] = course_df['Time'].apply(
        lambda x: (re.findall(r'[\u4e00-\u9fff]+', x)))
    course_df['Day'] = course_df['raw_day'].apply(
        lambda x: ', '.join(x))
    # course_df['Period'] = course_df['Time'].apply(
    #     lambda x: re.findall(r'[^\u4e00-\u9fff]+', x)[0])
    course_df['Title'] = course_df.Title.apply(lambda x: x.strip())
    # course_df['Period'] = course_df.Period.apply(lambda x: x.strip())
    return course_df


def main(local=False):

    st.set_page_config(
        page_title="Simple NTU Course Viewer",
        page_icon="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/282/books_1f4da.png",
        layout="wide",
        initial_sidebar_state="expanded",
    )

    with st.spinner('讀取資料中⋯'):  # read data
        course_df = read_df(local)
        course_df = pre_processing(course_df.copy())
    st.write("""
    # 台大 110 年課表查詢""")

    col1, col2 = st.beta_columns((7, 4))
    with col1:
        search_txt = st.text_input(
            '輸入課程名稱/ID/老師名稱', '')

        need_help = st.beta_expander('需要幫忙嗎 👉')
        with need_help:
            st.markdown(
                """輸入**課程名稱**或是**課程 ID** 或是**老師名稱**。不能夠同時輸入課程名稱和老師名稱。""", unsafe_allow_html=True)

    with col2:
        valid_column = course_df.drop('raw_day', axis=1).columns
        view_options = st.multiselect(
            '選擇檢視欄位',
            list(valid_column),
            list(valid_column))

    days = ['一', '二', '三', '四', '五', '六', '日']
    # days_select = [False for i in range(7)]

    if 'days_select' not in st.session_state:
        st.session_state['days_select'] = [False for i in range(7)]

    with st.form("date_picker"):
        st.write("選擇上課日")
        cols = st.beta_columns(7)
        for i, col in enumerate(cols):
            st.session_state['days_select'][i] = col.checkbox(
                days[i])

        date_opt = st.radio("篩選條件", ('Subset', 'All Matched'))

        # Every form must have a submit button.
        submitted = st.form_submit_button("確認")
        if submitted:
            # st.write(st.session_state['days_select'])
            days_select = st.session_state['days_select']
            pass

    other_info = st.beta_expander('其他資訊 🔗')
    with other_info:
        st.markdown("""一些常用連結：

+ [PTT NTUcourse 看板](https://www.ptt.cc/bbs/NTUcourse/index.html)
+ [Original Repo](https://github.com/hungchun0201/NTUclassCrawler)
+ [台大課程網](https://nol.ntu.edu.tw/nol/guest/index.php)

<span style="font-size: 10px">* 註：僅為小型試用版，故僅用 Streamlit 簡單製作而已。若有不週全的地方，請自行修正 🙌🏾</span>
                    """, unsafe_allow_html=True)

    df = course_df

    def in_list(x, date_opt):
        if date_opt == 'Subset':
            if set(x).issubset(set(np.array(days)[st.session_state['days_select']])):
                return True
            else:
                return False
        else:
            if set(x) == set(np.array(days)[st.session_state['days_select']]):
                return True
            else:
                return False

    with st.spinner("結果產生中⋯"):
        if search_txt == "" and np.sum(st.session_state['days_select']) == 0:
            display_df = df[view_options]
        else:
            if np.sum(st.session_state['days_select']) == 0:
                display_df = df[(df['Title'].str.contains(search_txt) | df['Instructor'].str.contains(
                    search_txt) | df['Id'].str.contains(search_txt))][view_options]
            else:
                display_df = df[(df['Title'].str.contains(search_txt) | df['Instructor'].str.contains(
                    search_txt) | df['Id'].str.contains(search_txt)) & course_df['raw_day'].apply(in_list, args=(date_opt,))][view_options]
    st.write(
        f"<h2>課程搜尋結果 <span style='font-size: 12pt'>({int(display_df.shape[0])}筆結果)</span></h2>", unsafe_allow_html=True)

    with st.spinner(text='顯示資料中⋯'):
        _ = st_material_table(display_df)

    footer = """

<style>
footer {
    visibility: hidden;
}

footer:after {
    content:'© Brian L. Chen'; 
	visibility: visible;
	display: block;
	position: relative;
	text-align: center;
}
</style>"""

    st.markdown(footer, unsafe_allow_html=True)

    st.balloons()


if __name__ == '__main__':
    args = parse_args()
    if args.local:
        main(local=True)
    else:
        main()
